'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AssetList } from '@/components/assets/AssetList'
import { CreateAssetButton } from '@/components/assets/CreateAssetButton'
import { useLocalizedStrings } from '@/contexts/LocaleContext'


export default function AssetsPage() {
  const { getStrings } = useLocalizedStrings()
  const assetsStrings = getStrings().assets
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{assetsStrings.title}</h1>
              <p className="text-gray-600 mt-2">
                {assetsStrings.subtitle}
              </p>
            </div>
            <CreateAssetButton />
          </div>
          
          <AssetList />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
