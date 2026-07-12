import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import TableFilter from './TableFilter'

export default function CustomersContent() {
  return (
    <Card>
        <CardHeader>
            <p className='text-lg font-bol mb-3'>Users</p>
            {/* <TableFilter /> */}
        </CardHeader>
        <CardContent>
            
        </CardContent>
    </Card>
  )
}
