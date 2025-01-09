'use client'
import { deletePostAction } from "@/actions/post.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import {Trash2} from 'lucide-react'

const DeletePostModal : React.FC<{postId : string}> = ({postId}) => {

  const handleDeletePost = async (postId : string)=>{
    const res = await deletePostAction(postId)
        if (res.success){
            toast({
                title: "Post deleted successfully",
                className : 'bg-emerald-600'
            })
        }else{
            console.log(res);
            toast({
                title: "Failed to delete post",
                variant : 'destructive'
            })
        }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2 size={18}/>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure about deleting this post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleDeletePost(postId)} >Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePostModal;
