import { Injectable, OnModuleInit } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDoctorType } from '@/modules/user/entities';

@Injectable()
export class UserDoctorTypeSeed implements OnModuleInit {
  constructor(
    @InjectRepository(UserDoctorType)
    private readonly userDoctorTypesRepository: Repository<UserDoctorType>,
  ) {}

  async onModuleInit() {
    const count = await this.userDoctorTypesRepository.count();
    if (count === 0) await this.loadInitialData();
  }

  private async loadInitialData() {
    const data: DeepPartial<UserDoctorType>[] = [
      {
        id: 1,
        name: 'Cardiologist',
        description: 'Specializes in heart-related conditions and treatments.',
      },
      {
        id: 2,
        name: 'Surgeon',
        description:
          'Performs surgical procedures to treat various conditions.',
      },
      {
        id: 3,
        name: 'Dermatologist',
        description: 'Focuses on skin, hair, and nail disorders.',
      },
      {
        id: 4,
        name: 'Ophthalmologist',
        description: 'Specializes in eye and vision care.',
      },
      {
        id: 5,
        name: 'Pediatrician',
        description:
          'Provides medical care for infants, children, and adolescents.',
      },
      {
        id: 6,
        name: 'Neurologist',
        description: 'Treats disorders of the nervous system.',
      },
      {
        id: 7,
        name: 'OrthopedicSurgeon',
        description: 'Specializes in the musculoskeletal system.',
      },
      {
        id: 8,
        name: 'Gynecologist',
        description: "Focuses on women's reproductive health.",
      },
      {
        id: 9,
        name: 'Urologist',
        description:
          'Treats urinary tract and male reproductive system disorders.',
      },
      {
        id: 10,
        name: 'Allergist',
        description:
          'Diagnoses and treats allergies and immune system disorders.',
      },
      {
        id: 11,
        name: 'Endocrinologist',
        description: 'Specializes in hormone-related conditions.',
      },
      {
        id: 12,
        name: 'Gastroenterologist',
        description: 'Focuses on digestive system disorders.',
      },
      {
        id: 13,
        name: 'Hematologist',
        description: 'Treats blood-related disorders.',
      },
      {
        id: 14,
        name: 'InfectiousDiseaseSpecialist',
        description: 'Focuses on infectious diseases and their treatment.',
      },
      {
        id: 15,
        name: 'Nephrologist',
        description: 'Specializes in kidney care and diseases.',
      },
      {
        id: 16,
        name: 'Oncologist',
        description: 'Treats cancer and provides cancer care.',
      },
      {
        id: 17,
        name: 'Pulmonologist',
        description: 'Focuses on lung and respiratory system disorders.',
      },
      {
        id: 18,
        name: 'Rheumatologist',
        description: 'Treats autoimmune and musculoskeletal diseases.',
      },
      {
        id: 19,
        name: 'Psychiatrist',
        description: 'Specializes in mental health and psychiatric disorders.',
      },
      {
        id: 20,
        name: 'PlasticSurgeon',
        description: 'Performs reconstructive and cosmetic surgeries.',
      },
      {
        id: 21,
        name: 'Radiologist',
        description: 'Uses imaging techniques to diagnose and treat diseases.',
      },
      {
        id: 22,
        name: 'Geriatrician',
        description: 'Focuses on healthcare for elderly patients.',
      },
      {
        id: 23,
        name: 'Obstetrician',
        description:
          'Specializes in pregnancy, childbirth, and postpartum care.',
      },
      {
        id: 24,
        name: 'Anesthesiologist',
        description: 'Manages anesthesia during surgical procedures.',
      },
      {
        id: 25,
        name: 'PainManagementSpecialist',
        description: 'Treats chronic pain conditions.',
      },
      {
        id: 26,
        name: 'Immunologist',
        description: 'Focuses on immune system disorders.',
      },
      {
        id: 27,
        name: 'Neonatologist',
        description:
          'Provides care for newborns, especially premature or ill infants.',
      },
      {
        id: 28,
        name: 'Hepatologist',
        description:
          'Specializes in liver, gallbladder, and pancreas disorders.',
      },
    ];

    await this.userDoctorTypesRepository.save(data);
  }
}
