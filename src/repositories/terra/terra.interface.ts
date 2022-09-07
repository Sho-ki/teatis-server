/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GetTerraAuthUrlResponse extends ErrorResponse {
	status: string;
	user_id?: string;
	auth_url?: string;
}

interface ErrorResponse{
    message?:string;
}

export interface GetTerraAuthUrlRequest{
    resource:string;
    reference_id: string;
    auth_success_redirect_url: string;
    auth_failure_redirect_url: string;
}

export interface GetAllCustomersResponse{
	status: string;
	users: {
		user_id: string;
		last_webhook_update: string | null;
		provider: string;
    }[];

}

export declare namespace GetCustomerGlucoseLogResponse {
    export interface RootObject {
        status: string;
        data: Datum[];
        type: string;
        user: User;
    }

    export interface HydrationData {
        hydration_amount_samples: any[];
        day_total_water_consumption_ml?: any;
    }

    export interface MeasurementsData {
        measurements: any[];
    }

    export interface OxygenData {
        vo2max_ml_per_min_per_kg?: any;
        saturation_samples: any[];
        avg_saturation_percentage?: any;
        vo2_samples: any[];
    }

    export interface BloodPressureData {
        blood_pressure_samples: any[];
    }

    export interface DetailedBloodGlucoseSample {
        glucose_level_flag: number;
        trend_arrow: number;
        blood_glucose_mg_per_dL: number;
        timestamp: Date;
    }

    export interface BloodGlucoseSample {
        glucose_level_flag: number;
        trend_arrow: number;
        blood_glucose_mg_per_dL: number;
        timestamp: Date;
    }

    export interface GlucoseData {
        day_avg_blood_glucose_mg_per_dL: number;
        detailed_blood_glucose_samples: DetailedBloodGlucoseSample[];
        blood_glucose_samples: BloodGlucoseSample[];
    }

    export interface Detailed {
        hr_samples: any[];
        hrv_samples_sdnn: any[];
        hrv_samples_rmssd: any[];
    }

    export interface Summary {
        avg_hrv_sdnn?: any;
        max_hr_bpm?: any;
        resting_hr_bpm?: any;
        user_max_hr_bpm?: any;
        avg_hr_bpm?: any;
        avg_hrv_rmssd?: any;
        min_hr_bpm?: any;
    }

    export interface HeartRateData {
        detailed: Detailed;
        summary: Summary;
    }

    export interface HeartData {
        pulse_wave_velocity_samples: any[];
        afib_classification_samples: any[];
        heart_rate_data: HeartRateData;
    }

    export interface TemperatureData {
        body_temperature_samples: any[];
        skin_temperature_samples: any[];
        ambient_temperature_samples: any[];
    }

    export interface Metadata {
        start_time: Date;
        end_time: Date;
    }

    export interface DeviceData {
        serial_number: string;
        activation_timestamp: Date;
        hardware_version: string;
        software_version?: any;
        other_devices: any[];
        manufacturer: string;
        name: string;
    }

    export interface Datum {
        hydration_data: HydrationData;
        measurements_data: MeasurementsData;
        oxygen_data: OxygenData;
        blood_pressure_data: BloodPressureData;
        glucose_data: GlucoseData;
        heart_data: HeartData;
        temperature_data: TemperatureData;
        metadata: Metadata;
        device_data: DeviceData;
    }

    export interface User {
        user_id: string;
        provider: string;
        last_webhook_update: Date;
    }

}

