/*
   Red eats Green
   Green eats Blue
   Blue eats Red
*/

const w = 125
const h = 180
let canvas, ctx
let canvas2, ctx2

const setPixel = (imgD, x, y, colorIndex)=>{
    const colors = [[255,0,0,255],[0,255,0,255],[0,0,255,255]]
    const [r,g,b,a] = colors[colorIndex]
    const index = y*w*4+x*4
    imgD.data[index] = r
    imgD.data[index+1] = g
    imgD.data[index+2] = b
    imgD.data[index+3] = a
}

const getPixel = (imgD, x, y)=>{
    const index = y*w*4+x*4
    let r = imgD.data[index]
    let g = imgD.data[index+1]
    let b = imgD.data[index+2]
    let a = imgD.data[index+3]
    return [r,g,b,a]
}

const isSurroundedByColor = (imgD,x,y,colorIndex)=>{
    let count = 0
    for(let i=x-1;i<=x+1;++i){
        for(let j=y-1;j<=y+1;++j){
            if(i>=0&&i<w&&j>=0&&j<h)
            if(getPixel(imgD,i,j)[colorIndex])
             count++
        }
    }
    return count
}

const splashRandomPaint = ()=>{
    const {random,PI,floor} = Math
    const styles = ["rgb(255,0,0)", "rgb(0,255,0)", "rgb(0,0,255)"]
    ctx.fillRect(0,0,w,h)
    for(let i=0;i<800;++i){
        ctx.fillStyle = styles[floor(random()*3)]
        ctx.strokeStyle = styles[floor(random()*3)]
        ctx.beginPath()
        ctx.arc(random()*w, random()*h, random()*5,0,2*PI)
        ctx.fill()
        ctx.stroke()
    }
}

//search pixels in imgd
//replace pixel in imgd2
//update canvas with imgd2

const loop = ()=>{
    let imgD = ctx.getImageData(0,0,w,h)
    let imgD2 = ctx.getImageData(0,0,w,h)
    for(let y=0;y<h;++y){
        for(let x=0;x<w;++x){
            let color = getPixel(imgD, x, y)
            color.pop()
            let maxVal = Math.max(...color)
            let colorIndex = color.indexOf(maxVal)
            
            let eatingColor = (colorIndex + 3-1)%3
            if(isSurroundedByColor(imgD,x,y,eatingColor)>2){
                setPixel(imgD2,x,y,eatingColor)
            }
        }
    }
    ctx.putImageData(imgD2,0,0)
    requestAnimationFrame(loop)
}

const start = ()=>{
    canvas = document.querySelector("canvas")
    canvas.width = w
    canvas.height = h
    ctx = canvas.getContext("2d")
    splashRandomPaint()
    loop()
}

onload = start