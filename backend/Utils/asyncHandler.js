// const asyncHandler = (fn) =>{
//     return(req ,res, next)=>{
//         Promise.resolve(fn(req , res, next)).
//         catch(e)
//         {
//             res.status(500).json({msg:e.message})
//         }
//     }
// }

const asyncHandler = (fn) =>(req , res, next)=>{
    Promise.resolve(fn(req ,res,next)).
    catch((errors)=>{
        res.status(500).json({msg:errors.message})
    })
}

export default asyncHandler;