
import { ContentHeader } from '@/components/layout/ContentHeader'
import PlansHeader from '@/components/plans/PlansHeader'
import { prisma } from '@/lib/prisma'
import PlansTable from '@/components/plans/PlansTable'

async function page() {
  const plans = await prisma.plans.findMany({
    orderBy: {
      status: "asc"
    }
  })
  return (
    <>
      <div className='py-5'>
        <PlansHeader />
        <PlansTable plans={plans}/>
      </div>
    </>
  )
}

export default page