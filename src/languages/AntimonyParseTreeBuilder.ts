interface Compartment {
  name: string;
}

interface Species {
  name: string;
  compartment: string;
}

interface Reaction {
  name: string;
  equation: string;
}

interface Declaration {
  name: string;
  value: string | number;
}

interface Initialization {
  name: string;
  value: string;
}

interface Display {
  var: string;
  name: string;
}

export interface ParseTreeNode {
  type: string;
  content?: string;
  children?: ParseTreeNode[];
}

export interface AntimonyModel {
  compartments: Map<string, Compartment>;
  species: Map<string, Species>;
  reactions: Map<string, Reaction>;
  declarations: Map<string, Declaration>;
  initializations: Map<string, Initialization>;
  displays: Map<string, Display>;
}

export function createParseTree(parsedArray: AntimonyModel[]): ParseTreeNode[] {
  const parseTree: ParseTreeNode[] = [];

  parsedArray.forEach((model) => {
    model.compartments.forEach((compartment) => {
      parseTree.push({
        type: 'compartment',
        content: compartment.name,
      });
    });

    model.species.forEach((species) => {
      parseTree.push({
        type: 'species',
        content: species.name,
        children: [
          {
            type: 'compartment',
            content: species.compartment,
          },
        ],
      });
    });

    model.reactions.forEach((reaction) => {
      parseTree.push({
        type: 'reaction',
        content: reaction.name,
        children: [
          {
            type: 'equation',
            content: reaction.equation,
          },
        ],
      });
    });

    model.declarations.forEach((declaration) => {
      parseTree.push({
        type: 'declaration',
        content: declaration.name,
      });
    });

    model.initializations.forEach((init) => {
      parseTree.push({
        type: 'initialization',
        content: `${init.name} = ${init.value}`,
      });
    });

    model.displays.forEach((display) => {
      parseTree.push({
        type: 'display',
        content: `${display.var} is "${display.name}"`,
      });
    });
  });

  return parseTree;
}
