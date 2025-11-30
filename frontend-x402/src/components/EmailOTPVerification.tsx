'use client'

import React, { useState } from 'react'
import { useOkto, OktoContextType } from 'okto-sdk-react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface EmailOTPVerificationProps {
  onVerificationSuccess?: () => void
  onVerificationError?: (error: Error) => void
}

export const EmailOTPVerification: React.FC<EmailOTPVerificationProps> = ({
  onVerificationSuccess,
  onVerificationError,
}) => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpToken, setOtpToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'email' | 'otp'>('email')

  const { sendEmailOTP, verifyEmailOTP } = useOkto() as OktoContextType

  const validateEmail = (e: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(e)
  }

  const handleSendOTP = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const response = await sendEmailOTP(email)
      setOtpToken(response.token)
      setStep('otp')
      alert('OTP sent successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
      console.error('Send OTP Error:', err)
      alert(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const success = await verifyEmailOTP(
        email,
        otp,
        otpToken!,
      )
      if (success) {
        onVerificationSuccess?.()
        alert('Email verified successfully')
        setStep('email')
      } else {
        alert('Invalid OTP')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify OTP'
      setError(errorMessage)
      onVerificationError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{step === 'email' ? 'Email Verification' : 'OTP Verification'}</CardTitle>
        <CardDescription>
          {step === 'email'
            ? 'Enter your email address to receive a verification code'
            : 'Enter the OTP sent to your email'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'email' ? (
          <div className="space-y-4">
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              type="email"
              disabled={loading}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                setError(null)
              }}
              type="number"
              maxLength={6}
              disabled={loading}
            />
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          className="w-full"
          onClick={step === 'email' ? handleSendOTP : handleVerifyOTP}
          disabled={loading || (step === 'email' ? !email : !otp)}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {step === 'email' ? 'Sending OTP' : 'Verifying OTP'}
            </>
          ) : (
            step === 'email' ? 'Send OTP' : 'Verify OTP'
          )}
        </Button>
        {step === 'otp' && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setStep('email')
              setOtp('')
              setError(null)
            }}
          >
            Change Email / Resend OTP
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

