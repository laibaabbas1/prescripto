import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
//api to reg user
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        //validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter A Valid Email" });

        }

        //validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: 'Enter A Strong Password' })
        }

        // hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        //to save this data in database
        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API for user login
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User does not exist ' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Invalid credentials' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

//new API  to get the user's profile data
const getProfile = async (req, res) => {

    try {

        const userId = req.userId; // get from middleware, NOT from req.body
        const userData = await userModel.findById(userId).select("-password");

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

//API to update user profile
const updateProfile = async (req, res) => {
    try {

        const userId = req.userId
        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data missing" })
        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            /////////////////upload img to cloudinary/////////////
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: "Profile Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to book appointment 
const bookAppointment = async (req, res) => {

    try {
        const userId = req.userId; // Middleware se ID leini h
        const { docId, slotDate, slotTime } = req.body

        if (!docId || !slotDate || !slotTime) {
            return res.json({ success: false, message: "Missing appointment details" });
        }
        const docData = await doctorModel.findById(docId).select('-password')

        //to check if the dr is available or not for booking 
        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available" })
        }

        let slots_booked = docData.slots_booked

        //check for slots availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available" })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }


        const userData = await userModel.findById(userId).select("-password")
        // delete docData.slots_booked//deleting the slots booked data from the doctor data bcz we have to save the doctor data in the apointment data also and in apoitment data i dont want to save unnecessary data thats why delet slots books from docdata 

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }
        //to save data appointment data in database
        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in doctors data
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment Booked" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//API to get appointments for frontend my-appointment page
const listAppointment = async (req, res) => {

    try {
        const userId = req.userId;//to get userid from middleware
        // Agar userId nahi milta hai
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication failed. User not found." });
        }
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error fetching appointments." })
    }
}
// API to cancel appointment
const cancelAppointment = async (req, res) => {

    try {
        const userId = req.userId//get userid from authtoken means(middleware)
        const { appointmentId } = req.body //get appointmenyt from body

        const appointmentData = await appointmentModel.findById(appointmentId)
        //verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized action" })
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })


        //releasing dr slot

        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        //update the latest slots booked data with the doctors data
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment Cancelled" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error fetching appointments." })
    }
}





export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment }