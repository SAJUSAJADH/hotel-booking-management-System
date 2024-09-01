'use client'
import { fetchUserInfo, getRecommendedHotels } from '@/actions/server'
import StayCard2 from '@/components/StayCard2'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'


const Recommendations =  () => {

    const { user } = useUser()
    const [featuredPlaces, setFeaturedPlaces] = useState([])

  useEffect(()=>{
    const getFeaturedjobs = async () => {
      if(user){
        
        const customer = await fetchUserInfo(user?.id);
        const purposeOfTrip = customer?.purposeOfTrip
        console.log('1')
        const ipResponse = await fetch('https://api.ipify.org')
        console.log('2')
        const ip = await ipResponse.text()
        console.log('3')
        const locResponse = await fetch(`http://ip-api.com/json/${ip}`)
        console.log('4')
        const location = await locResponse.json()
        console.log('5')
        const { city } = await location
        const formData = new FormData()
        if(purposeOfTrip && city){
          formData.append('location', city)
          formData.append('description', purposeOfTrip)
          console.log('6')
          const response = await fetch('/api/recommend', {
              cache: 'no-store',
                method: 'POST',
                body: formData,
            })
            const data = await response.json();
            console.log('7')
            const hotelNames = await data.map((hotel: any) => hotel.Hotel_Name);
            const featuredPlaces = await getRecommendedHotels(hotelNames)
            console.log('8')
            setFeaturedPlaces(featuredPlaces)
            console.log('9')
      }
      }
    }
    getFeaturedjobs()
  },[user])  

  return (
    <div className="p-10 w-full min-h-screen">
        <h2 className='text-3xl lg:text-6xl'>Recommended stays for you</h2>
        <div className='p-10 grid lg:grid-cols-4 gap-5'>
          {
           featuredPlaces.length == 0 && <div className="flex w-full h-full justify-center items-center"><ButtonPrimary loading>please wait</ButtonPrimary></div>
          }
          {
            featuredPlaces && featuredPlaces.length > 0 && 
            featuredPlaces.map((place: any, index)=>(
              <StayCard2 key={place?._id} data={place} stay={''}/>
            ))
          }
        </div>
    </div>
  )
}

export default Recommendations