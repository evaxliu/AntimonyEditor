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

interface Function {
  name: string;
  function: string;
}

interface Annotation {
  variable: string;
  annotation: string;
}

interface Initialization {
  name: string;
  value: string;
}

interface Display {
  var: string;
  name: string;
}

interface AntimonyModel {
  compartments: Map<string, Compartment>;
  species: Map<string, Species>;
  reactions: Map<string, Reaction>;
  functions: Map<string, Function>;
  annotations: Map<string, Annotation>;
  declarations: Map<string, Declaration>;
  initializations: Map<string, Initialization>;
  displays: Map<string, Display>;
}

export function parseAntimonyModel(antimonyModel: string): AntimonyModel {
  const lines = antimonyModel.split('\n');
  const model: AntimonyModel = {
    compartments: new Map(),
    species: new Map(),
    reactions: new Map(),
    functions: new Map(),
    annotations: new Map(),
    declarations: new Map(),
    initializations: new Map(),
    displays: new Map()
  };

  let currentSection: 'compartments' | 'species' | 'reactions' | 'declarations' | 'initializations' | 'displays' | 'annotations' | 'functions' | null = null;
  let lastCompartment: string | null = null;
  let lastAnnotVar: string | "";

  lines.forEach((line) => {
    if (line.trim().startsWith('//')) {
      // Skip comments
      return;
    }

    if (line.trim().length === 0) {
      // Skip empty lines
      return;
    }

    if (line.trim().startsWith('model')) {
      // Skip the model definition
    }

    if (line.trim().startsWith('compartment')) {
      currentSection = 'compartments';
    }

    if (line.trim().startsWith('species')) {
      currentSection = 'species';
    }

    if (line.includes(':')) {
      currentSection = 'reactions';
    }
    
    if (line.trim().startsWith('function')) {
      currentSection = 'functions';
    }

    if (line.includes('http')) {
      currentSection = 'annotations';
    }

    if (line.includes('=')) {
      currentSection = 'initializations'
    }

    if (line.includes('is')) {
      currentSection = 'displays'
    }

    if (line.trim().startsWith('var ') || line.trim().startsWith('const ')) {
      currentSection = 'declarations';
    }

    let match;
    switch(currentSection) {
      case 'compartments':
        match = line.match(/compartment (.+);/);
        if (match) {
          const compartmentNames = match[1].split(',').map((name) => name.trim());
          compartmentNames.forEach((compartmentName) => {
            model.compartments.set(compartmentName, { name: compartmentName });
            lastCompartment = compartmentName;
          });
        }
        break;
      case 'species':
        match = line.match(/species (.+)/);
        if (match) {
          const speciesLines = match[1].split(',').map((speciesLine) => speciesLine.trim());
          speciesLines.forEach((speciesLine) => {
            const speciesName = speciesLine.split(' ')[0].replace('$', '');
            const compartmentMatch = speciesLine.match(/in (.+)/);
            if (compartmentMatch) {
              const compartment = compartmentMatch[1].trim();
              model.species.set(speciesName, { name: speciesName, compartment });
            } else if (lastCompartment) {
              model.species.set(speciesName, { name: speciesName, compartment: lastCompartment });
            } else {
              console.warn(
                'Warning: Species found before any compartment declaration. Assigning to default compartment.'
              );
              model.species.set(speciesName, { name: speciesName, compartment: 'default' });
            }
          });
        }
        break;
      case 'functions':
        match = line.match(/function (.+)/);
        if (match) {
          const functionArgs = match[1].trim();
          const functionName = functionArgs.split('(')[0];
          model.functions.set(functionName, {
            name: functionName,
            function: functionArgs
          });
        }
        break;
      case 'annotations':
        match = line.match(/(.+) "([^"]+)"/);
        if (match) {
          const variable = match[1].trim().split(" ")[0];
          const annotation = match[2].trim();
          if (variable !== "") {
            if (model.annotations.has(variable)) {
              model.annotations.set(variable, {
                variable: variable,
                annotation: model.annotations.get(variable)?.annotation + "," + annotation
              });
            } else {
              model.annotations.set(variable, {
                variable: variable,
                annotation: annotation
              });
              lastAnnotVar = variable;
            }
          } else {
            model.annotations.set(lastAnnotVar, {
              variable: lastAnnotVar,
              annotation: model.annotations.get(lastAnnotVar)?.annotation + "," + annotation
            });
          }
        }
        break;
      case 'reactions':
        match = line.match(/(\S+): (.+);/);
        if (match) {
          const reactionName = match[1];
          model.reactions.set(reactionName, {
            name: reactionName,
            equation: match[2],
          });
        }
        break;
      case 'declarations':
        match = line.match(/(var (.+)|const (.+))/);
        if (match) {
          const declarationNames = match[1].split(',').map((name) => name.trim().replace('const ', ''));
          declarationNames.forEach((name) => {
            model.declarations.set(name, { name: name, value: ''});
          });
        }
        break;
      case 'initializations':
        match = line.match(/(\S+)\s*=\s*(.+);/);
        if (match) {
          const initName = match[1];
          model.initializations.set(initName, {
            name: initName,
            value: match[2].trim()
          })
        }
        break;
      case 'displays':
        match = line.match(/([^=]+) is "(.+)";/);
        if (match) {
          const varName = match[1].trim();
          model.displays.set(varName, { 
            var: varName, 
            name: match[2].trim()
          })
        }
        break;
    }
  });
  return model;
}
