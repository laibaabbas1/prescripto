import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/*left section  */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>Prescripto is an online healthcare platform that connects you with certified doctors for virtual consultations. Receive expert medical advice and prescriptions from the comfort of your home, 24/7. Our platform offers quick, reliable, and affordable healthcare solutions. Experience the future of healthcare, anytime, anywhere.</p>
                </div>
                {/* center section */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                {/* right section  */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+92-222-7651</li>
                        <li>laibaabbas431@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div>
                {/* copyright text */}
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2025@ Prescripto - All Rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer