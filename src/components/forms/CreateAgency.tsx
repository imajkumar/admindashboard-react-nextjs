// src/components/forms/CreateAgency.tsx

"use client"

import React from 'react'
import { Form, Input, Button } from 'antd';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CreateAgency = () => {
    const { t } = useLanguage();
    return (
        <>
            <div className='flex justify-between'>
                <div className='flex gap-2 items-center'>
                    <Button type="text" className='!text-black  !bg-white rounded-full' icon={<ChevronLeft size={24} />} />
                    <h1 className="text-2xl font-semibold">
                        {t("addAgancy", "heading")}
                    </h1>
                </div>

                <div>
                    <Button type="primary" className="bg-primary">
                        {t("createAgancy", "heading")}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default CreateAgency;