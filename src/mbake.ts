#!/usr/bin/env node
// License} LGPL 2.1  (c) Metabake.net | Cekvenich

import AdmZip = require('adm-zip')
import commandLineArgs = require('command-line-args')

import { Ver, MBake,  Dirs} from './lib/Base'
import clear = require("cli-clear")

clear()

// imports done /////////////////////////////////////////////
const cwd:string = process.cwd()

function version() {
   let b = new Ver()
   console.log()
   console.log('88b           d88  88                       88                  ');
   console.log('888b         d888  88                       88                  ');
   console.log('88`8b       d8\'88  88                       88                  ');
   console.log('88 `8b     d8\' 88  88,dPPYba,   ,adPPYYba,  88   ,d8   ,adPPYba,');
   console.log('88  `8b   d8\'  88  88P\'    "8a  ""     `Y8  88 ,a8"   a8P_____88');
   console.log('88   `8b d8\'   88  88       d8  ,adPPPPP88  8888[     8PP"""""""');
   console.log('88    `888\'    88  88b,   ,a8"  88,    ,88  88`"Yba,  "8b,   ,aa');
   console.log('88     `8\'     88  8Y"Ybbd8"\'   `"8bbdP"Y8  88   `Y8a  `"Ybbd8"\'');
   console.log();
   console.log('mbake CLI version: '+b.ver())
   console.log()
   console.log('Usage: ')
   console.log('                                                         mbake .    # or path')
   console.log()
   console.log('  or process any_dir to make(bake) a declarative low-code app recursively')
   console.log('  To process Pug and RIOT *-tag.pug tags:                mbake -t . # or path, also does regular mbake of Pug')
   console.log('  To process Pug and dat_i items to items.json:          mbake -i . # where path is folder containing dat_i.yaml')
   console.log(' ----------------------------------------------------------------')
   console.log()
   console.log(' Code examples:')
   console.log('  For a starter website:                                 mbake -s')
   console.log('  For an example dynamic web app CRUD:                   mbake -c')

   console.log('  For a starter blog|items:                              mbake -b')

   console.log('  For a starter dash web app:                            mbake -d')
   console.log('  For example slides markdown:                           mbake -l')

   console.log('  mbakeW CLI has more flags and features:                mbakeW')
   console.log()
   console.log(' Full docs: https://www.Metabake.net' )
   console.log()

   process.exit()
}

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'mbake', defaultOption: true},
   { name: 'items',  alias: 'i', type: Boolean },
   { name: 'tag',    alias: 't', type: Boolean },

   { name: 'blog',   alias: 'b', type: Boolean },
   { name: 'dash',   alias: 'd', type: Boolean },
   { name: 'slides', alias: 'l', type: Boolean },

   { name: 'website',  alias: 's', type: Boolean },
   { name: 'crud',   alias: 'c', type: Boolean },

]
const argsParsed = commandLineArgs(optionDefinitions)
let arg:string = argsParsed.mbake

console.log()

// unzip: ////////////////////////////////////////////////////////////////////////////////////////////
function unzipC() {
   let src:string =__dirname+ '/crud.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted an example auth/crud to ./crud')
   process.exit()
}
function unzipS() {
   let src:string =__dirname+ '/website.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter website to ./website')
   process.exit()
}
function unzipB() {
   let src:string =__dirname+ '/blog.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter blog app to ./blog')
   process.exit()
}
function unzipD() {
   let src:string =__dirname+ '/dash.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted an starter Dash web app to ./dash')
   process.exit()
}
function unzipL() {
   let src:string =__dirname+ '/slidesEx.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted example of markdown slides to ./slidesEx')
   process.exit()
}
// get folder to be processed: ///////////////////////////////////////////////////////////////////////////////////////////////////////
if(arg) {
   arg = Dirs.slash(arg)
   if(arg.startsWith('/'))  {
      //do nothing, full path is arg
   } else if (arg.startsWith('..')) { // few  cases to test
      arg = arg.substring(2)
      let d = cwd
      d = Dirs.slash(d)
      // find offset
      let n = d.lastIndexOf('/')
      d = d.substring(0,n)
      arg = d + arg
   } else if (arg.startsWith('.')) {//cur

      arg = cwd //test ./dd

   } else  { // just plain, dir passed
      arg = cwd + '/' + arg
   }
}

// pug: ////////////////////////////////////////////////////////////////////////////////////////////////
function bake(arg) {
   new MBake().bake(arg)
   process.exit()
}

// itemize : /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function itemize(arg) {
   new MBake().itemizeNBake(arg)
   process.exit()
}

function tag(arg) {
   new MBake().tag(arg)
}

// start: /////////////////////////////////////////////////////////////////////////////////////
if(argsParsed.tag) {
   try {
      tag(arg)
      bake(arg)
   } catch(err) {
      console.log(err)
   }
}
else if(argsParsed.items)
   itemize(arg)
else if(argsParsed.blog)
   unzipB()
else if(argsParsed.dash)
   unzipD()
else if(argsParsed.crud)
   unzipC()
else if(argsParsed.website)
   unzipS()
else if(argsParsed.slides)
   unzipL()
else if(!arg)
   version()
else
   bake(arg)
