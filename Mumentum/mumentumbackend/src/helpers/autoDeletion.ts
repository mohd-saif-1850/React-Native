import { Challenge } from "../models/challenge.model"
import { User } from "../models/user.model"
import { Task } from "../models/task.model"

const expiredChallenge = async () => {
    const now = new Date()

    const expiredChallenges = await Challenge.find({
        end: { $lt: now },
        challengeStatus: { $ne: "expired" }
    })

    for (const challenge of expiredChallenges) {

        if (challenge.completedBy?.length) {
            await User.updateMany(
                {
                    _id: { $in: challenge.completedBy }
                },
                {
                    $inc: {
                        challengeStreak: 1
                    }
                }
            )
        }

        challenge.challengeStatus = "expired"
        await challenge.save()
    }
}

const deactivateExpiredTasks = async () => {
    const now = new Date()

    await Task.updateMany(
        {
            expiresAt: { $lt: now },
            isActive: true
        },
        {
            $set: {
                isActive: false
            }
        }
    )
}

const autoDeleteUsers = async () => {
    const now = new Date()

    await User.deleteMany({
        deletion: { $lt: now }
    })
}


export {
    expiredChallenge,
    deactivateExpiredTasks,
    autoDeleteUsers
}