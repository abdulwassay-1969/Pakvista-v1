export type ProvinceContact = {
  province: string;
  emergency: {
    police: string;
    ambulance: string;
    fire: string;
    motorway: string;
  };
  tourism: {
    department: string;
    phone: string;
    website?: string;
    source: string;
    lastVerified: string;
  };
};

export const CONTACTS: ProvinceContact[] = [
  {
    province: "Punjab",
    emergency: { police: "15", ambulance: "1122", fire: "16", motorway: "130" },
    tourism: {
      department: "Tourism Development Corporation of Punjab (TDCP)",
      phone: "+92 42 99268014",
      website: "https://tdcp.gop.pk",
      source: "TDCP official portal",
      lastVerified: "2026-04-08",
    },
  },
  {
    province: "Sindh",
    emergency: { police: "15", ambulance: "115", fire: "16", motorway: "130" },
    tourism: {
      department: "Culture, Tourism, Antiquities & Archives Department Sindh",
      phone: "+92 21 99206313",
      website: "https://culturetourism.sindh.gov.pk",
      source: "Sindh Government tourism portal",
      lastVerified: "2026-04-08",
    },
  },
  {
    province: "Khyber Pakhtunkhwa",
    emergency: { police: "15", ambulance: "1122", fire: "16", motorway: "130" },
    tourism: {
      department: "Khyber Pakhtunkhwa Culture and Tourism Authority (KPCTA)",
      phone: "+92 91 9213067",
      website: "https://kpcta.kp.gov.pk",
      source: "KPCTA official portal",
      lastVerified: "2026-04-08",
    },
  },
  {
    province: "Balochistan",
    emergency: { police: "15", ambulance: "1122", fire: "16", motorway: "130" },
    tourism: {
      department: "Sports, Culture, Tourism, Archives & Youth Affairs Department Balochistan",
      phone: "+92 81 9202204",
      website: "https://balochistan.gov.pk",
      source: "Balochistan Government portal",
      lastVerified: "2026-04-08",
    },
  },
  {
    province: "Gilgit-Baltistan",
    emergency: { police: "15", ambulance: "1122", fire: "16", motorway: "130" },
    tourism: {
      department: "Tourism Department Gilgit-Baltistan",
      phone: "+92 5811 920665",
      website: "https://visitgilgitbaltistan.gov.pk",
      source: "Visit Gilgit-Baltistan portal",
      lastVerified: "2026-04-08",
    },
  },
  {
    province: "Azad Jammu & Kashmir",
    emergency: { police: "15", ambulance: "1122", fire: "16", motorway: "130" },
    tourism: {
      department: "Tourism & Archeology Department AJK",
      phone: "+92 5822 920304",
      website: "https://ajk.gov.pk",
      source: "AJK Government portal",
      lastVerified: "2026-04-08",
    },
  },
  {
    province: "Islamabad Capital Territory",
    emergency: { police: "15", ambulance: "1122", fire: "16", motorway: "130" },
    tourism: {
      department: "Pakistan Tourism Development Corporation (PTDC)",
      phone: "+92 51 9203223",
      website: "https://ptdc.gop.pk",
      source: "PTDC official portal",
      lastVerified: "2026-04-08",
    },
  },
];
