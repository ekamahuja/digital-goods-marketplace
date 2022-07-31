import { Config } from '../schemas/configSchema.js'

export async function updateConfig(req, res, next) {
    try {
        const {
          twoCaptchaTokenApiKey,
          discordServer,
          maxReplacements,
          replacementCooldown,
          feedbackLink,
          spotifyLogin,
          contactLink,
          affilateMinimumPayout,
        } = req.query;
        
        if (twoCaptchaTokenApiKey) await Config.updateOne({}, {twoCaptchaTokenApiKey})
        if (discordServer) await Config.updateOne({}, {discordServer})
        if (maxReplacements) await Config.updateOne({}, {maxReplacements})
        if (replacementCooldown) await Config.updateOne({}, {replacementCooldown})
        if (spotifyLogin) await Config.updateOne({}, {spotifyLogin})
        if (contactLink) await Config.updateOne({}, {contactLink})
        if (affilateMinimumPayout) await Config.updateOne({}, {affilateMinimumPayout})
        if (feedbackLink) await Config.updateOne({}, {feedbackLink})

        const config = await Config.find({}).select("-_id").select("-__v").select("-createdAt").select("-_immutable").select("-updatedAt")
        res.status(200).json({ success: true, message: "Succesfully updated", config: config[0]})
    } catch (err) {
        next(err)
    }
}
