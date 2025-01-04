'use server'

const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/

import { usersModel } from "@/utils/models/user"
import { cookies } from "next/headers"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { connectToDb } from "@/utils/db/connectToDb"

const boyImages = ['boy1.png', 'boy2.png' , 'boy3.png']
const girlImages = ['girl.png', 'girl2.png', 'girl3.png']

export const createUserAction = async (formdata : FormData) => {
    try {
        await connectToDb()
        const entries = Object.fromEntries(formdata)
        const fullname = entries.fullname as string
        const email = entries.email as string
        const password = entries.password as string
        const gender = entries.gender as string

        if (!fullname || !email || !password || !gender) {
            return { message: 'Please fill all fields', success: false }
        }

        const user = await usersModel.findOne({ email })
        if (user) {
            return { message: 'User already exists', success: false }
        }

        if (password.length < 8) {
            return { message: 'Password must be at least 8 characters long', success: false }
        }

        if (!emailRegex.test(email)) {
            return { message: 'Invalid email address or format', success: false }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const token = await jwt.sign({ email }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        })

        // Adding user token to cookies
        const cookiesStore = await cookies()
        cookiesStore.set('next-social-token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
            sameSite: 'strict',
            secure: true,
        })
        
        // Adding user to database
        await usersModel.create({
            fullname,
            email,
            gender,
            password: hashedPassword,
            img: `/avatars/${gender === 'male' ? boyImages[Math.floor(Math.random() * boyImages.length)] : girlImages[Math.floor(Math.random() * girlImages.length)]}`
        })
        
        return { success: true, message: 'User created successfully' }
    } catch (error) {
        // Convert error object to plain object
        const plainError = JSON.parse(JSON.stringify(error))
        return { message: 'Error creating user', success: false, error: plainError }
    }
}