interface Config {
  environments: {
    prod: Environment
  }
  repository: Repository
}

interface Environment {
  account: string
  apiDomainName: string
  contactEmail: string
  contactName: string
  googleTagManagerId: string
  notificationRecipientEmail: string
  notificationSenderEmail: string
  notificationSenderName: string
  region: string
  rootDomainName: string
  websiteDomainName: string
}

interface Repository {
  branch: string
  connectionArn: string
  name: string
  owner: string
}

const config: Config = {
  environments: {
    prod: {
      account: "001113062250",
      apiDomainName: "api.mileszko.pl",
      contactEmail: "kontakt@mileszko.pl",
      contactName: "Amadeusz Mileszko",
      googleTagManagerId: "GTM-P7Z4GMRJ",
      notificationRecipientEmail: "amadeusz@mileszko.pl",
      notificationSenderEmail: "powiadomienia@mileszko.pl",
      notificationSenderName: "Powiadomienia - Amadeusz Mileszko",
      region: "eu-central-1",
      rootDomainName: "mileszko.pl",
      websiteDomainName: "mileszko.pl",
    },
  },
  repository: {
    branch: "main",
    connectionArn:
      "arn:aws:codeconnections:eu-central-1:001113062250:connection/edb61b32-d134-4e90-a829-1c947e4fc491",
    name: "mileszko-landing-page",
    owner: "amileszko",
  },
};

export { config, type Environment, type Repository };
