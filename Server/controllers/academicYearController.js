import Academicyear from "../models/AcademicYear.js";

 export const createAcademicYear=
 async(req,res)=>{
    try{
        const{
            name,
            startDate,
            endDate
        }=req.body;

        const year=
        Academicyear.create({
            name,
            startDate,
            endDate
        });
        res.status(200).json({
            success:true,
            data:year,
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server error",
        });
    }
     
 }; 

 export const getAcademicYear=async(req,res)=>{
    try{
        const years=Academicyear.find().sort({cratedAt:-1});

        res.status(200).json({
            success:true,
            count:years.length,
            data:years,
        });
    }
    catch(error)
    {
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Server error"

        });
    }
 }

 export const updateAcademicYear=async(req,res)=>{
    try{
        const {id}=req.params;

        const updatedYear=await Academicyear.findByIdAndUpdate(
            id,
            req.body,
            {
                new:true,
                runValidators:true,
            }
        );
        if (!updatedYear) {
      return res.status(404).json({
        success: false,
        message: "Academic Year not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedYear,
    });
}catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
 };

export const deleteAcademicYear=async(req,res)=>
{
    try{
        const {id}=req.params;

        const deletedAcademicYear=await Academicyear.findByIdAndDelete(id);

        if(!deleteAcademicYear)
        {
            res.status(400).json({
                success:false,
                message:"Academic year not deleted",
            }
            );
        }
        res.status(200).json({
            success:true,
            message:"Academic year deleted sucessfully",
        })
    }catch(error)
    {
        res.status(500).json({
            success:false,
            message:"Server error",
        });
    }
};