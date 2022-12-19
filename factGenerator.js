import {createClient} from 'pexels'
import Jimp from "jimp"
import fs from "fs"
import {facts} from "./facts.js"
import * as dotenv from "dotenv"
dotenv.config()

async function generateImage(imagePath){
    let fact = randomFact()
    let photo = await getRandomImage(fact.animal)
    await editImage(photo,imagePath,fact.fact)
}

function randomFact(){
    let fact = facts[randomInt(0, (facts.length - 1))]

    return fact
    
}

function randomInt(min,max){
    
    return Math.round(Math.random()*(max-min)+min)
}

async function getRandomImage(animal){
    try{
        console.log(process.env.PIXELS_API_KEY)
        const client = await createClient(process.env.PIXELS_API_KEY)
        const query = animal
        let image

        await client.photos.search({query, per_page: 10}).then(
            res=>{
                let images = res.photos
                image = images[randomInt(0,(images.length - 1))]
            
            }
        )
        return image
    }
    

    catch(e){
        console.log('error downloading image',error)
        getRandomImage(animal)
    }
}

async function editImage(image,imagePath,fact){
    try{
        let imgURL = image.src.medium
        let animalImage = await Jimp.read(imgURL).catch(error=>console.log('error',error))
        console.log(animalImage)
        let animalImageWidth = animalImage.bitmap.width
        let animalImageHeight = animalImage.bitmap.height
        let imgDarkener = await new Jimp(animalImageWidth, animalImageHeight, '#000000')
        imgDarkener = await imgDarkener.opacity(0.5)
        animalImage = await animalImage.composite(imgDarkener, 0, 0)

        let posX = animalImageWidth/15
        let posY = animalImageHeight/15
        let maxWidth = animalImageWidth - (posX*2)
        let maxHeight = animalImageHeight - posY

        let font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
    await animalImage.print(font, posX, posY, {
      text: fact,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, maxWidth, maxHeight)

    await animalImage.writeAsync(imagePath)
    console.log("Image generated successfully")
    }
    catch(error){
        console.log("error editing image",error)
    }
}

const deleteImage = (imagePath) =>{
    fs.unlink(imagePath,(err)=>{
        if(err){
            return
        }
    console.log('file deleted')
    })
} 

export {generateImage, deleteImage}