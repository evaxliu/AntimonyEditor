import React from 'react';


async function createAnnotation(word: string) {
    const selection = word;

    // Find type of the selected word
    // Code Here...
    const selectedType: string = '';

    var databases;
    if (selectedType === 'compartment') {
        databases = [
            { label: 'Gene Ontology*', id: 'gontology'},
            { label: 'Cell Type Ontology*', id: 'contology'},
            { label: 'Mouse Adult Gross Anatomy*', id: 'montology'},
            { label: 'Ontology for Biomedical Investigations*', id: 'bontology'},
            { label: 'Foundational Model of Anatomy*', id: 'fontology'},
            { label: 'ChEBI', id: 'chebi' },
            { label: 'Protein Ontology', id: 'pontology'},
            { label: 'UniProt', id: 'uniprot'},
            { label: 'RHEA', id: 'rhea'}];
    } else if (selectedType === 'species') {
        databases = [
            { label: 'ChEBI*', id: 'chebi' },
            { label: 'Protein Ontology*', id: 'pontology'},
            { label: 'UniProt*', id: 'uniprot'},
            { label: 'RHEA', id: 'rhea'},
            { label: 'Gene Ontology', id: 'gontology'},
            { label: 'Cell Type Ontology', id: 'contology'},
            { label: 'Mouse Adult Gross Anatomy', id: 'montology'},
            { label: 'Ontology for Biomedical Investigations', id: 'bontology'},
            { label: 'Foundational Model of Anatomy', id: 'fontology'}];
    } else if (selectedType === 'reaction') {
        databases = [
            { label: 'Gene Ontology*', id: 'gontology'},
            { label: 'RHEA*', id: 'rhea'},
            { label: 'ChEBI', id: 'chebi' },
            { label: 'Protein Ontology', id: 'pontology'},
            { label: 'UniProt', id: 'uniprot'},
            { label: 'Cell Type Ontology', id: 'contology'},
            { label: 'Mouse Adult Gross Anatomy', id: 'montology'},
            { label: 'Ontology for Biomedical Investigations', id: 'bontology'},
            { label: 'Foundational Model of Anatomy', id: 'fontology'}];
    } else {
        databases = [
            { label: 'ChEBI', id: 'chebi' },
            { label: 'UniProt', id: 'uniprot'},
            { label: 'RHEA', id: 'rhea'},
            { label: 'Gene Ontology', id: 'gontology'},
            { label: 'Cell Type Ontology', id: 'contology'},
            { label: 'Protein Ontology', id: 'pontology'},
            { label: 'Ontology for Biomedical Investigations', id: 'bontology'},
            { label: 'Foundational Model of Anatomy', id: 'fontology'},
            { label: 'Mouse Adult Gross Anatomy', id: 'montology'}];
    }

    

    // Insert Annotation into Model
    // const entity = selectedItem.entity;
	// const id = entity['id'];
	// const prefix = entity['prefix'];
	// let snippetText;
	// if (prefix === 'rhea') {
	// 	snippetText = `\n\${1:${entityName}} identity "https://www.rhea-db.org/rhea/${id}"`;
	// } else if (prefix === 'ontology') {
	// 	snippetText = `\n\${1:${entityName}} identity "${entity['iri']}"`;
	// } else {
	// 	snippetText = `\n\${1:${entityName}} identity "http://identifiers.org/${prefix}/${id}"`;
	// }
	// const snippetStr = new vscode.SnippetString(snippetText);
	// const doc = vscode.window.activeTextEditor.document;
	// const pos = doc.lineAt(line).range.end;
	// vscode.window.activeTextEditor.insertSnippet(snippetStr, pos);
}