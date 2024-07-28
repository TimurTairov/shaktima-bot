// require('dotenv').config();
import { Bot, GrammyError, HttpError, webhookCallback } from 'grammy';
const token = '6060359502:AAHglU9CyZitphh2N_Lw76VNZI4cFTAHTuc'
const bot = new Bot(token);
//import { userList } from './userList'
const ADMIN_ID = [257640114, 375850680, 925983969, 431418459]
export default webhookCallback(bot, "std/http");

const userList = [
  {
    id: 431418459,
    name: 'Юлия Таирова',
    username: '@juliya_tairova',
  },
  {
    id: 257640114,
    name: 'Tirthadeva (Timur Tairov)',
    username: '@tirthadeva',
  },
]

bot.command('start', async (ctx) => await ctx.reply('Welcome! Up and running.'))
bot.command('list', async (ctx) => {
  if (!ADMIN_ID.includes(ctx.chatId)) {
    return await ctx.reply(
      'Вы не можете отправлять команды боту, так как Вы не являетесь его администратором!'
    )
  }
  let i = 1
  let text = `Список пользователей:\n`
  for (const row of userList) {
    text = text + i + '. ' + row.id + ' ' + row.name + ' ' + row.username + ' ' + `\n`
    i++
  }
  await ctx.reply(text)
})

bot.command('text', async (ctx) => {
  await ctx.reply('Пришлите текст рассылки в бот ⤵️:')
})

bot.on('message', async (ctx) => {
  if (!ADMIN_ID.includes(ctx.chatId)) {
    return await ctx.reply(
      'Вы не можете отправлять команды боту, так как Вы не являетесь его администратором!'
    )
  }
  const txt = ctx.message.text
  let d = 0 //кол-во успешно отправленных сообщений
  let z = 0 //кол-во заблокированных сообщений
  for (const user of userList) {
    try {
      await bot.api.sendMessage(user.id, txt)
      d++
      await ctx.reply(
        `Сообщение пользователю ${user.username} успешно доставлено!`
      )
    } catch (error) {
      z++
      await ctx.reply(
        `Бот заблокирован пользователем: ${user.username}. ${error}`
      )
    }
  }
  ctx.reply(
    `Рассылка успешно завершена!\n` +
    `Сообщений отправлено: ${d} \nСообщений заблокировано: ${z}`
  )
})

bot.catch(async (err) => {
  const ctx = err.ctx
  console.error(`Error while handling update ${ctx.update.update_id}:`)
  const e = err.error
  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description)
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e)
  } else {
    console.error('Unknown error:', e)
  }
})

bot.start();

