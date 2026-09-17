'use client';

import React, { useState } from 'react';
import { AuthHeader } from '../../_components/AuthHeader';
import { AuthFooter } from '../../_components/AuthFooter';
import { EmergencyBanner } from '../../_components/EmergencyBanner';
import { StepIndicator } from './_components/StepIndicator';
import { Step1Personal, DriverPersonalData } from './_components/Step1Personal';
import { Step2Documents, DriverDocumentsData } from './_components/Step2Documents';
import { Step3Vehicle, DriverVehicleData } from './_components/Step3Vehicle';
import { Step4Otp } from './_components/Step4Otp';
import { Step5Success } from './_components/Step5Success';

export default function DriverRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [personalData, setPersonalData] = useState<DriverPersonalData>({
    avatarUrl: '',
    fullName: '',
    experienceYears: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [documentsData, setDocumentsData] = useState<DriverDocumentsData>({
    nidNumber: '',
    nidFront: null,
    nidBack: 'nid_back_v2.jpg', // Pre-populated example matching Figma state
    licenseNumber: '',
    licenseExpiry: '',
    licenseFront: null,
    licenseBack: null,
  });

  const [vehicleData, setVehicleData] = useState<DriverVehicleData>({
    vehiclePlate: '',
    ambulanceType: 'icu', // Matches Figma selected default
    equipment: {
      oxygen: true,
      ventilator: false,
      defibrillator: true,
      suction: false,
      stretcher: true,
      firstAidKit: true,
    },
    photos: [
      'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
    ],
  });

  const stepTitles = [
    'Personal Information',
    'Document Verification',
    'Vehicle & Equipment',
    'OTP Verification',
    'Success',
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      <AuthHeader subtitle="Paramedic Portal" />

      <main className="flex flex-1 flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all sm:p-10">
          {/* Top Progress & Step Header */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={5}
            stepTitle={stepTitles[currentStep - 1]}
          />

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <Step1Personal
              data={personalData}
              onUpdate={(fields) => setPersonalData((prev) => ({ ...prev, ...fields }))}
              onNext={handleNext}
            />
          )}

          {/* Step 2: Documents */}
          {currentStep === 2 && (
            <Step2Documents
              data={documentsData}
              onUpdate={(fields) => setDocumentsData((prev) => ({ ...prev, ...fields }))}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* Step 3: Vehicle & Equipment */}
          {currentStep === 3 && (
            <Step3Vehicle
              data={vehicleData}
              onUpdate={(fields) => setVehicleData((prev) => ({ ...prev, ...fields }))}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* Step 4: OTP Verification */}
          {currentStep === 4 && (
            <Step4Otp
              phoneNumber={personalData.phoneNumber}
              onVerify={handleNext}
              onBack={handleBack}
              onChangePhone={() => setCurrentStep(1)}
            />
          )}

          {/* Step 5: Application Submitted Success */}
          {currentStep === 5 && <Step5Success />}
        </div>
      </main>

      <AuthFooter supportEmail="driver.support@pulseroute.com" />
      <EmergencyBanner />
    </div>
  );
}
