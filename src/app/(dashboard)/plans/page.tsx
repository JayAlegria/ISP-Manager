
import { ContentHeader } from '@/components/layout/ContentHeader'
import { Separator } from '@/components/ui/separator'
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
      <ContentHeader pageTitle='Service Plans' />
      <Separator />
      <div className='py-5'>
        <PlansHeader />
        <PlansTable plans={plans}/>
      </div>
    </>
  )
}

export default page