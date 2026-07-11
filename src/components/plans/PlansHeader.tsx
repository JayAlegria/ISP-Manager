"use client"
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import AddPlanDrawer from './AddPlanDrawer'
import { Button } from '../ui/button'

export default function PlansHeader() {
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const handleDrawer = () => {
        setOpenDrawer(!openDrawer)
    }
    return (
        <>
            <div className='flex justify-between items-center'>
                <div>
                    <p className='font-bold text-2xl'>Service Plans Management</p>
                    <p>Manage internet plans offered to customers.</p>
                </div>
                <Button onClick={handleDrawer}> Add new plan <Plus /> </Button>
            </div>
            <AddPlanDrawer open={openDrawer} setOpen={handleDrawer} />
        </>
    )
}
