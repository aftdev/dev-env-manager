import process from 'process'

const oldCwd = process.cwd()

export const mochaHooks = {
  /**
   * Always reset the chdir as feature tests might have messed that up.
   */
  afterAll(done) {
    process.chdir(oldCwd)
    done()
  },
}
