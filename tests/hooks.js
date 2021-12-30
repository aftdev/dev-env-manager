import process from 'process'

const oldCwd = process.cwd()

export const mochaHooks = {
  /**
   * Always reset the chdir as feature test might have messed that up.
   *
   * @param {Function} done
   */
  afterEach(done) {
    process.chdir(oldCwd)
    done()
  },
}
