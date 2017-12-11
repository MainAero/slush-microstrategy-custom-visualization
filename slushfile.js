/*
 * slush-microstrategy-custom-visualizations
 * https://github.com/mainaero/slush-microstrategy-custom-visualizations
 *
 * Copyright (c) 2017, mainaero
 * Licensed under the MIT license.
 */

'use strict';

const ENTRYPOINT_BASE_FILE_NAME = 'entrypoint';
var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path'),
    sanitize = require('sanitize-filename');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || ''
    };
})();

gulp.task('default', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName
    },{
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer
        .prompt(prompts)
        .then(function (answers) {
          console.log(answers);
            if (!answers.moveon) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName);
            answers.appNameSanitized = sanitize(answers.appName).replace(/\s/g, '');
            gulp.src(__dirname + '/templates/**')
                .pipe(template(answers))
                .pipe(rename(function (file) {
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                    if (file.basename == ENTRYPOINT_BASE_FILE_NAME) {
                      file.basename = answers.appNameSanitized;
                    }
                }))
                .pipe(conflict('./' + answers.appNameSanitized))
                .pipe(gulp.dest('./' + answers.appNameSanitized))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});
