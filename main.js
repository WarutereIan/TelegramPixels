import {Telegraf} from "telegraf"
import {v4 as uuidv4} from "uuid"
import * as dotenv from "dotenv"
dotenv.config()

import {generateImage} from "./factGenerator.js"

const bot = new Telegraf(process.env.BOT_TOKEN)


bot.start((ctx)=>{
    let message = `use the /new_fact command to generate a new fact`
    ctx.reply(message)
})

bot.command('new_fact',async (ctx)=>{
    try{
        ctx.reply("Generating image, just a little longer")
        let imagePath = `./temp/${uuidv4()}.jpg`
        await generateImage(imagePath)
        await ctx.replyWithPhoto({source: imagePath})
    }
    catch(error){
        console.log('error', error)
        ctx.reply('error sending image')
    }
})

bot.launch()