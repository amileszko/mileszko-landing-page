interface Config {
  environments: {
    prod: Environment
  }
  githubToken: Secret
  repository: Repository
}

interface Environment {
  apiDomainName: string
  contactEmail: string
  contactName: string
  googleTagManagerId: string
  notificationRecipientEmail: string
  notificationSenderEmail: string
  notificationSenderName: string
  rootDomainName: string
  websiteDomainName: string
}

interface Repository {
  branch: string
  name: string
  owner: string
}

interface Secret {
  jsonField: string
  secretId: string
}

const config: Config = {
  environments: {
    prod: {
      apiDomainName: "api.mileszko.pl",
      contactEmail: "kontakt@mileszko.pl",
      contactName: "Amadeusz Mileszko",
      googleTagManagerId: "GTM-P7Z4GMRJ",
      notificationRecipientEmail: "amadeusz@mileszko.pl",
      notificationSenderEmail: "powiadomienia@mileszko.pl",
      notificationSenderName: "Powiadomienia - Amadeusz Mileszko",
      rootDomainName: "mileszko.pl",
      websiteDomainName: "mileszko.pl",
    },
  },
  githubToken: {
    jsonField: "githubToken",
    secretId: "mileszko-secrets",
  },
  repository: {
    branch: "main",
    name: "mileszko-landing-page",
    owner: "amileszko",
  },
};

export { config, type Environment, type Repository, type Secret };
