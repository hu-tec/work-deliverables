// Keep the website's offline guide in sync with its Markdown source.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'AI_작업요청_프롬프트_가이드', 'README.md');
const output = path.join(root, 'AI_작업요청_프롬프트_가이드', 'content.js');
const markdown = fs.readFileSync(source, 'utf8').replace(/\r\n/g, '\n');
const generated = '// Generated from README.md by scripts/build-prompt-guide.js.\n' +
  'window.PROMPT_GUIDE_MARKDOWN = ' + JSON.stringify(markdown) + ';\n';

if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== generated) {
    console.error('Prompt guide content.js is out of date. Run node scripts/build-prompt-guide.js.');
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(output, generated, 'utf8');
  console.log(path.relative(root, output));
}
