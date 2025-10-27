module.exports = {
  default: {
    require: ['src/step-definitions/**/*.ts', 'src/support/**/*.ts'],
    format: ['progress', 'html:test-results/cucumber-report.html', 'json:test-results/cucumber-report.json'],
    publishQuiet: true
  }
}
