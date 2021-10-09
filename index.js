#!/usr/bin/env node
// to make this program executable

const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const program = require('caporal');
const fs = require('fs');
const {spawn } = require('child_process');
const { inherits } = require('util');
const chalk = require('chalk');

program
   .version('0.0.1')
   .argument('[filename]','Name of a file to execute')
   .action( async ({ filename })=>{
      const name = filename || 'index.js';
      try{
      await fs.promises.access(name);
      }catch(err){
         throw new Error(`Could not find the file \'${filename}\'`);
      }

      let proc;
      const start = debounce( () => {
         if(proc){
            // if there is an old process running stop it and start the new one
            proc.kill();
         }
         console.log(chalk.blue.bold(">>>>> Starting process ..."));
         // the command is node then the filename the user choose
         proc= spawn('node', [name],{stdio:'inherit'} );
      }, 100);

      // watch the current file('.') for events
      chokidar.watch('.')
         // on addition
         .on('add',start)
         // on change
         .on('change',start)
         // on unlink (deleted)
         .on('unlink',start);

   });

program.parse(process.argv);

