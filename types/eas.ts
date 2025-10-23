// EAS GraphQL response types
export interface AttestationValue {
  value: string
}

export interface DecodedDataItem {
  name: string
  value: AttestationValue
}

export interface Attestation {
  id: string
  decodedDataJson: string
  schemaId: string
}

export interface GraphQLResponse {
  data: {
    attestations: Attestation[]
  }
}

// Store attestation metadata
export interface StoreAttestationMetadata {
  uid: string
  schemaId: string
}

// Store creation attestation response (EAS specific)
export interface StoreCreationAttestation {
  id: string
}

export interface StoreCreationResponse {
  data: {
    attestations: StoreCreationAttestation[]
  }
}
