


const { runGeneratedTest } = require('../utils/runGeneratedTest');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const executeScript = async (req, res) => {
const { v4: uuidv4 } = require("uuid");


  const { script, testName = 'test', creds } = req.body;

  if (!script) return res.status(400).json({ error: 'Missing script in request body' });

  const runId = uuidv4();
  const resultsDir = path.join(__dirname, 'test-results', `${testName}-${runId}`);

  // Ensure folder exists
  fs.mkdirSync(resultsDir, { recursive: true });

  const env = {
    ...process.env,
    FLOW_JSON_FROM_REQUEST: JSON.stringify(script),
    PLAYWRIGHT_JSON_OUTPUT: path.join(resultsDir, 'report.json'), // save JSON report here
    PLAYWRIGHT_RESULTS_DIR: resultsDir,
    CREDS_FROM_REQUEST: JSON.stringify(creds || {})
  };

  const child = spawn('npx', [
    'playwright', 'test',
    'tests/flowRunner.spec.js',
    '--reporter=json',
    '--output', resultsDir
  ], {
    env,
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe']
  });


  let output = '';
  let errorOutput = '';

  child.stdout.on('data', data => output += data.toString());
  child.stderr.on('data', data => errorOutput += data.toString());

  child.on('close', (code) => {
    if (code === 0) {
      res.json({
        message: 'Test executed successfully',
        runId,
        resultsDir,
        reportPath: env.PLAYWRIGHT_JSON_OUTPUT
      });
    } else {
      res.status(500).json({
        message: 'Test execution failed',
        runId,
        error: errorOutput || output,
        resultsDir
      });
    }
  });

 

};

module.exports = { executeScript };
