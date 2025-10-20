const fs = require('fs').promises
const path = require('path')

const settingsPath = path.join(__dirname, '../settings.json')

const viewAllSettings = async (req, res) => {
  try {
    const raw = await fs.readFile(settingsPath, 'utf-8')
    const settings = JSON.parse(raw)
    return res.status(200).json(settings)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

const viewSettings = async (req, res) => {
  try {
    const raw = await fs.readFile(settingsPath, 'utf-8')
    const parsed = JSON.parse(raw)

    const visibleSettings = Object.entries(parsed)
      .filter(([key, value]) => value.private === false)
      .map(([key, value]) => ({ key, ...value }))

    return res.status(200).json(visibleSettings)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}
const updateSettings = async (req, res) => {
  try {
    await fs.writeFile(settingsPath, JSON.stringify(req.body, null, 2))
    return res.status(200).json({success: 'Settings were updated successfully!'})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

module.exports = {
  viewAllSettings,
  viewSettings,
  updateSettings,
}
