import React, { FC, ReactNode } from 'react'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '../ui/drawer'
import { Separator } from '../ui/separator'
import { Spinner } from '../ui/spinner'
import { Button } from '../ui/button'

interface TFormDrawer {
    title: string,
    id: string,
    formInputs: ReactNode,
    buttonText: string,
    IsOpen: boolean
    form: any
    onSubmit?: (data: any) => void
    onCancel?: () => void
    setIsOpen?: () => void
}
const FormDrawer: FC<TFormDrawer> = ({ id, title, formInputs, buttonText, onCancel, onSubmit, IsOpen, setIsOpen, form }) => {
    return (
        <Drawer open={IsOpen} onOpenChange={setIsOpen} swipeDirection='right'>
            <DrawerContent>
                <form onSubmit={form.handleSubmit(onSubmit)} id={id} className='flex min-h-0 flex-1 flex-col'>
                    <DrawerHeader className='py-5'>
                        <DrawerTitle className="font-bold">{title}</DrawerTitle>
                    </DrawerHeader>
                    <Separator />
                    <div className='min-h-0 flex-1 overflow-y-auto px-5 py-5'>
                        {formInputs}
                    </div>
                </form>
                <DrawerFooter >
                    <Button type='submit' form={id}>{form.formState.isSubmitting ? <Spinner /> : buttonText}</Button>
                    <Button className="bg-gray-200 text-foreground hover:text-background" onClick={onCancel}>Cancel</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default FormDrawer 