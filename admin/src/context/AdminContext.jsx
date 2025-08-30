import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
                // console.log(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailability = async (docId) => {
        console.log("1. Trying to change availability for doctor:", docId);

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            console.log("2. API Response:", data);

            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
                console.log("3. API was successful. Reloading page now...");

                // window.location.reload();

            } else {
                toast.error(data.message)
                console.log("4. API call failed with message:", data.message);

            }

        } catch (error) {
            toast.error(error.message)
            console.log("5. An error occurred in catch block:", error);

        }
    }



    const getAllAppointments = async () => {

        try {
            const { data } = await axios.get(backendUrl + "/api/admin/appointments", { headers: { aToken } })

            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to cancell th appoitment in admin panel
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                //after cancelling appointment to fetch latest appointment details
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    //API to get the dashboard data
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData);

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }


    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        getAllDoctors, changeAvailability,
        appointments, setAppointments, getAllAppointments,
        cancelAppointment,
        dashData, getDashData
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>

    )
}

export { AdminContext }
export default AdminContextProvider   