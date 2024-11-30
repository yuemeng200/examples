const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
class WhisperTranscriber {
  constructor(options = {}) {
    this.modelSize = options.modelSize || 'tiny'
    this.language = options.language || 'zh'
    this.outputDir = options.outputDir || 'output'
    this.device = 'cpu'
    this.pythonPath = options.pythonPath || path.join(__dirname, 'venv/bin/python3.10')
  }

  async transcribe(audioPath) {
    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`)
    }

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }

    const fileName = path.basename(audioPath, path.extname(audioPath))
    const outputPath = path.join(this.outputDir, `${fileName}.txt`)

    try {
      console.time('Transcription Time')
      console.log('Starting transcription...')

      const process = spawn(this.pythonPath, [
        '-m', 'whisper',
        audioPath,
        '--model', this.modelSize,
        '--language', this.language,
        '--device', this.device,
        '--output_dir', this.outputDir,
        '--output_format', 'txt',
        '--beam_size', '1',
        '--best_of', '1',
        '--temperature', '0'
      ])

      process.stdout.on('data', (data) => {
        console.log(data.toString())
      })

      process.stderr.on('data', (data) => {
        console.warn(data.toString())
      })

      await new Promise((resolve, reject) => {
        process.on('close', (code) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`Process exited with code ${code}`))
          }
        })
      })

      const text = fs.readFileSync(outputPath, 'utf8')
      
      console.timeEnd('Transcription Time')
      console.log('Transcription completed')

      return {
        text,
        outputPath
      }
    } catch (error) {
      console.error('Transcription failed:', error)
      throw error
    }
  }
}

// 使用示例
async function main() {
  try {
    const transcriber = new WhisperTranscriber({
      modelSize: 'tiny',
      language: 'zh',
      outputDir: 'transcriptions'
    })

    console.log('Using device:', transcriber.device)
    const result = await transcriber.transcribe(path.join(__dirname, 'web-components.wav'))
    console.log('Transcription result:', result.text)
  } catch (error) {
    console.error('Error:', error)
    console.log('Please make sure the virtual environment is properly set up')
  }
}

module.exports = WhisperTranscriber

if (require.main === module) {
  main()
}
