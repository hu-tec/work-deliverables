// Keep the website's offline guide in sync with its Markdown source.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const guideDir = path.join(root, '04_작업_가이드', 'AI_작업요청_프롬프트_가이드');
const readMarkdown = filename => fs.readFileSync(path.join(guideDir, filename), 'utf8').replace(/\r\n/g, '\n');
const topics = {
  accessibility: readMarkdown('웹접근성_프롬프트.md'),
  seoAeo: readMarkdown('SEO_AEO_프롬프트.md'),
  privacy: readMarkdown('개인정보_자격증발급_프롬프트.md')
};
const artifacts = [
  {
    output: path.join(guideDir, 'content.js'),
    generated: '// Generated from README.md by scripts/build-prompt-guide.js.\n' +
      'window.PROMPT_GUIDE_MARKDOWN = ' + JSON.stringify(readMarkdown('README.md')) + ';\n'
  },
  {
    output: path.join(guideDir, 'specialized-content.js'),
    generated: '// Generated from topic Markdown files by scripts/build-prompt-guide.js.\n' +
      'window.SPECIALIZED_PROMPT_GUIDES = ' + JSON.stringify(topics) + ';\n'
  }
];

if (process.argv.includes('--check')) {
  artifacts.forEach(({output, generated}) => {
    if (fs.existsSync(output) && fs.readFileSync(output, 'utf8') === generated) return;
    console.error(path.relative(root, output) + ' is out of date. Run node scripts/build-prompt-guide.js.');
    process.exitCode = 1;
  });
} else {
  artifacts.forEach(({output, generated}) => {
    fs.writeFileSync(output, generated, 'utf8');
    console.log(path.relative(root, output));
  });
}
