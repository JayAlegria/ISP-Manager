import React, { FC, ReactNode } from 'react'

interface TPageHeaderAction {
    title: string
    description: string
    actionButton: ReactNode
    children?: ReactNode
}
 const PageHeaderAction:FC<TPageHeaderAction> = ({title, description, actionButton, children}) => {
    return (
        <>
            <div className='flex justify-between items-center'>
                <div>
                    <p className='font-bold text-2xl'>{title}</p>
                    <p>{description}</p>
                </div>
                {actionButton}
            </div>
            {children}
        </>
    )
}

export default PageHeaderAction