/// <reference types="@figma/plugin-typings" />

// Plugin para detectar variáveis externas não publicadas em Figma apenas na seleção
(async function () {
    // Mantém o plugin ativo para garantir logs antes de fechar
    figma.showUI('', { visible: false });

    const fileKey = figma.fileKey;
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
        console.warn('Nenhum nó selecionado. Selecione ao menos um nó.');
    }
    // Inclui nós selecionados e seus descendentes
    const allNodes = selection.flatMap(node => [node, ...node.findAll()]);

    for (const node of allNodes) {
        const bindings = node.boundVariables;
        if (!bindings) continue;

        for (const property in bindings) {
            const varId = bindings[property].variableId;
            try {
                // Obtém o objeto Variable para acessar collectionId
                const variable = await figma.variables.getVariableByIdAsync(varId);
                const collectionId = variable.variableCollectionId;

                if (collectionId === fileKey) {
                    // Variável local (arquivo atual) — não interessa aqui
                    continue;
                }

                // Para coleções externas, tenta carregar a coleção
                try {
                    await figma.variables.getVariableCollectionByIdAsync(collectionId);
                    // Se carregar, significa que origin foi publicada — ignora
                } catch (err) {
                    // Se falhar, a coleção externa pode não estar publicada na origem
                    console.error(
                        `Variável externa não publicada em node “${node.name}”: ${variable.name} (${varId})`
                    );
                }

            } catch (e) {
                // Se falhar ao obter a variável, ignora — foco só em externals não publicadas
            }
        }
    }

    figma.closePlugin();
})();
  