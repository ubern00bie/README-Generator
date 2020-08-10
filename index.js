// modules required to run
const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");

//promisify from utility applied to writeFile from 'fs'
const readFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

const questions = [
  {
    type:"input",
    message:"Project Title: ",
    name:"title"
  },
  {
    type:"input",
    message:"Project Description: ",
    name:"description"
  },
  {
    type:"input",
    message:"Installation Information: ",
    name:"installation"
  },
  {
    type:"input",
    message:"Usage: ",
    name:"usage"
  },
  { 
    type:"list",
    message:"License: ",
    name:"license",
    choices: ['MIT','GNU','BSD']
  },
  {
    type:"input",
    message:"Contribution Information: ",
    name:"contribution"
  },
  {
    type:"input",
    message:"Tests: ",
    name:"tests"
  },
  {
    type:"input",
    message:"Contact info - E-mail Address: ",
    name:"contactinfo"
  },
  {
    type:"input",
    message:"GitHub username: ",
    name:"github"
  }
]

// run prompts with inquirer to get generate user data
function getUserData() {
  return inquirer.prompt(questions)
}

//generate README text using 'template literals'
function generateText(answers,badge) {
  return `
  # Title: ${answers.title}
>${badge}

  ## Description
  ${answers.description}

  ## Table of Contents
  - [Heading](## Description)
  - [Heading](## Installation-Instructions)
  - [Heading](## Contribution-Guidelines)
  - [Heading](## Usage-Information)
  - [Heading](## Testing-Instructions)
  - [Heading](## Feedback)
  - [Heading](## License)


  ## Installation-Instructions
  ${answers.installation}

  ## Usage-Information
  ${answers.usage}

  ## Contribution-Guidelines
  ${answers.contribution}

  ## Testing-Instructions
  ${answers.tests}
  >Test 1
  >Test 2
  >Test 3

  ## Feedback 
  For questions or information about this README generator, I can be reached at ${answers.contactinfo} 
  Find me on GitHub here: https://www.github.com/${answers.github}
  
  ## License
  ${licenseTxt}
`
}

var licenseTxt;
var badge;
async function init() {
  try {
    const answers = await getUserData(questions);
    
    if (answers.license === "MIT"){
      badge = '[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)'
    }
    else if(answers.license === "GNU"){
      badge = '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)';
    }
    else if(answers.license === "BSD"){
      badge = '[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)';
    }
    else { 
      badge = 'License choice invalid'
    }
    licenseTxt = await readFile('license' + answers.license + '.txt', 'utf8');
    const README = generateText(answers,badge);
    await writeToFile("README.md", README);
    console.log("Successfully wrote README file");
  } catch(err) {
    console.log(err);
  }
}

init();


