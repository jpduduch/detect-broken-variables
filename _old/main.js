/// <reference types="@figma/plugin-typings" />

figma.on('run', () => {

    // Check if there is a selection.
    if (figma.currentPage.selection.length === 0) {
        figma.closePlugin("Select at least one layer.");
    }

    get_document_variables();

    figma.closePlugin("Check console.");
})

async function get_document_variables() {
    const figma_variables = await figma.variables.getLocalVariablesAsync();

    console.log(figma_variables.length);

    if (figma_variables.length === 0) {
        figma.closePlugin("No variables detected in file.");
    }

    // for (const variable_instance of figma_variables) {
    //     console.log(
    //         `
    //         From library?: ${variable_instance.remote ? 'Yes' : 'No'}\n
    //         \n
    //         `
    //     )
    // }

    return figma_variables;
}







// -------- FIGMA PLUGIN ENTRY POINT -----------------------------------------

// figma.on("run", () => {
//     // Abort early if the user forgot to select anything
//     if (figma.currentPage.selection.length === 0) {
//         figma.notify("Select at least one layer first.");
//         figma.closePlugin();
//         return;
//     }

//     const report = [];

//     // Depth‑first walk over a node and its children
//     function walk(node) {
//         // 1. Does this node have any variable bindings?
//         if ("boundVariables" in node && node.boundVariables) {
//             for (const prop in node.boundVariables) {
//                 const binding = node.boundVariables[prop];

//                 // A binding can be a single object or an array (e.g. multiple fills)
//                 const ids = Array.isArray(binding)
//                     ? binding.map(b => b.id)
//                     : [binding.id];

//                 ids.forEach(id => {
//                     const v = figma.variables.getVariableById(id);   // ⇽ returns null if deleted / hidden

//                     // -- Determine binding status ------------------------------------
//                     let status;
//                     if (!v) {
//                         status = "MISSING (deleted or hidden library)";
//                     } else {
//                         /* [Unverified]  The Variables API exposes
//                            a boolean flag that mirrors styles:  v.remote  (or v.isRemote in some older builds).
//                            We cover both to be safe.  */
//                         status = (v.remote || v.isRemote) ? "REMOTE (library)" : "LOCAL";
//                     }

//                     report.push({
//                         node: node.name,
//                         property: prop,
//                         variableId: id,
//                         variableName: v ? v.name : "—",
//                         status
//                     });
//                 });
//             }
//         }

//         // 2. Recurse into children
//         if ("children" in node) {
//             for (const child of node.children) walk(child);
//         }
//     }

//     // Kick things off for every root item in the current selection
//     figma.currentPage.selection.forEach(walk);

//     // Dump a nice table to the DevTools console for quick inspection
//     // (you can replace this with figma.ui.postMessage(...) if you want a custom UI)
//     // @ts-ignore – console.table is available in the plugin sandbox

//     figma.closePlugin();
// });
  