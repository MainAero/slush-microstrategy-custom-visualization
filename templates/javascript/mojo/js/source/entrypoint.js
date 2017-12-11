(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.<%= appNameSanitized %>) {
        mstrmojo.plugins.<%= appNameSanitized %> = {};
    }
    // Custom mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
    // Declare the visualization object
    mstrmojo.plugins.<%= appNameSanitized %>.<%= appNameSanitized %> = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null,
        {
            // Define the Javascript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.<%= appNameSanitized %>.<%= appNameSanitized %>',
            cssClass: "<%= appNameSlug %>",
            errorDetails: "",
            useRichTooltip: true,
            reuseDOMNode: true,
            externalLibraries: [
                {url: ""}
            ],
            plot: function () {
                //...ADD YOUR JS CODE...
                this.domNode.innerText="Empty text";
            }
        });
})();
