import React from 'react'
import { Card, CardContent } from '../ui/card'

export default function CustomersCount() {
    const config = [
        {
            name: "All User",
            count: 120
        },
        {
            name: "Active User",
            count: 100
        },
        {
            name: "Inactive User",
            count: 20
        }
    ]
    return (
        <div className='flex justify-between gap-5 w-full my-10'>
            {
                config.map((info) => (
                    <Card key={info.name} className='w-[30%] p-5'>
                        <CardContent className='text-center'>
                            <p>{info.name}</p>
                            <p className='text-3xl font-bold mt-4'>{info.count}</p>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    )
}
