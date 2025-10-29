const  Comments = require('../model/NoticeComments')
const Notices = require('../model/NoticePosts')
const asyncHandler = require('express-async-handler')

exports.createComment = asyncHandler(async(req,res)=>{
    const {text,NoticeId} = req.body
    if(!text || !NoticeId){
        return res.status(400).json({message:"Text and Notice Id required"})
    }

    const notice = await Notices.findById(NoticeId)

    if(!notice){
        return res.status(404).json({message:"Notice not found"})
    }

    const comment = await Comments.create({text,NoticeId,createdBy:req.user.id})
    res.status(201).json({message:"Comment added Successfully",comment})
})


exports.getAllComments = asyncHandler(async(req,res)=>{
    const {noticeId} = req.params

    const comment = await Comments.find({NoticeId:noticeId})
    .populate('createdBy','name email').sort({createdAt:-1})
    res.status(200).json(comment)
})


exports.togglelike = asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const userId = req.user.id

    const comment = await Comments.findById(commentId)
    if(!comment){
        return res.status(404).json({message:'comment Not found'})
    }

    if(comment.likes.includes(userId)){
        comment.likes.pull(userId)
    }
    else{
        comment.likes.push(userId)
    }

    await comment.save()
    res.status(200).json({message:'like updated' ,likes:comment.likes.length})
})

exports.deleteComment = asyncHandler(async(req,res)=>{
    const{commentId} = req.params

    const comment  = await Comments.findById(commentId)
    if(!comment){
        return res.status(404).json({message:"comment not found"})
    }

    if(comment.createdBy.toString() !==req.user.id && req.user.role !== 'Admin'){
        return res.status(403).json({message:'Not authorized to delete this comment'})
    }

    await comment.deleteOne()
    res.status(200).json({message:"comment deleted successfully"})
})