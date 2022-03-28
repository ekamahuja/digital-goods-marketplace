import fs from 'fs'
import { Key } from '../schemas/keySchema.js'
import { upgradeLog } from '../schemas/upgradeLogSchema.js'

// fs.readFile('../server/src/utils/keys.json', 'utf8', async (err, data) => {
//     if (err) {
//         console.log(err)
//         return
//     }

//     const oldKeys = JSON.parse(data)
//     console.log(oldKeys.length)

//     for (let i = 0; i < oldKeys.length; i++) {

//         const oldKeyDate = new Date(oldKeys[i].createdAt.$date)
//         const howOld = ((new Date).getTime() - oldKeyDate.getTime()) / 3.154e+10

//         if (howOld < 1) {
//             let savedKey = await Key.create({
//                 value: oldKeys[i].value,
//                 type: (oldKeys[i].warranty) ? "onetime" : "lifetime",
//                 used: oldKeys[i].used,
                
//             })
//             console.log(savedKey.value)
//         }
//     }

//     console.log("done")
// })



// fs.readFile('../server/src/utils/upgradelogs.json', 'utf8', async (err, data) => {
//     if (err) {
//         console.log(err)
//         return
//     }

//     const oldUpgradeLogs = JSON.parse(data)
//     console.log(oldUpgradeLogs.length)

//     const keys = await Key.find({})
//     let usedKeys = 0

//     for (let i = 0; i < keys.length; i++) {
//         try {
//             if (keys[i].used) {
//                 usedKeys++
//                 const upgradeLogForKey = oldUpgradeLogs.find(log => log.key == keys[i].value)
//                 let keyUpgradeLog = await upgradeLog.create({
//                     email: (upgradeLogForKey.email).toLowerCase(),
//                     key: (upgradeLogForKey.key).toUpperCase(),
//                     upgrades: [{
//                         inviteLink: upgradeLogForKey.familyAccount.inviteLink,
//                         inviteAddress: upgradeLogForKey.familyAccount.address,
//                         inviteCountry: (upgradeLogForKey.country).toUpperCase(),
//                         userEmail: (upgradeLogForKey.email).toLowerCase(),
//                         userIp: upgradeLogForKey.ip
//                     }]
//                 })
            
//                 console.log(keyUpgradeLog.key)
//             }
//         } catch (err) {
//             console.error("KEY: " + keys[i].value)
//             console.error(err)
//         }
//     }

//     console.log(usedKeys)
    
// })
  



// async function checkInvalidUpgradeLog() {
//     try {
//         const allKeys = await Key.find({used: true})
//         console.log(`Amount of used keys: ${allKeys.length}`)

//         const allLogs = await upgradeLog.find({})
//         console.log(`Amount of logs: ${allLogs.length}`)

//         for (let i = 0; i < allKeys.length; i++) {
//             const keyLog = await upgradeLog.findOne({key: allKeys[i].value})
//             if (!keyLog) {
//                 console.log(`No log found for ${allKeys[i].value} key`)
//                 const key = await Key.findOne({value: allKeys[i].value})
//                 key.used = false
//                 await key.save()
//             }
//         }

//         console.log("Done!")
//     } catch (err) {
//         console.error(err)
//     }
// }

// checkInvalidUpgradeLog()

// async function getData() {
//     const usedKeys = await Key.find({used: true})
//     console.log(usedKeys.length)
// }


// getData()

