import firestore from '@react-native-firebase/firestore'

const callsCollection = () => firestore().collection('calls')

export const CALL_STATUS = {
  RINGING: 'ringing',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  ENDED: 'ended',
  MISSED: 'missed',
}

/**
 * Create an outgoing call document with WebRTC offer.
 */
export const createCall = async ({
  callerId,
  calleeId,
  callerName,
  calleeName,
  mode = 'audio',
  offer,
}) => {
  const ref = callsCollection().doc()
  const payload = {
    callerId,
    calleeId,
    callerName: callerName || 'User',
    calleeName: calleeName || 'User',
    mode: mode === 'video' ? 'video' : 'audio',
    status: CALL_STATUS.RINGING,
    participants: [callerId, calleeId],
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
    answer: null,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  }

  await ref.set(payload)
  return {id: ref.id, ...payload}
}

export const updateCallAnswer = async (callId, answer) => {
  await callsCollection()
    .doc(callId)
    .update({
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
      status: CALL_STATUS.ACCEPTED,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    })
}

export const updateCallStatus = async (callId, status) => {
  await callsCollection()
    .doc(callId)
    .update({
      status,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    })
}

export const addIceCandidate = async (callId, role, candidate) => {
  if (!candidate) {
    return
  }
  const collectionName =
    role === 'caller' ? 'callerCandidates' : 'calleeCandidates'
  await callsCollection()
    .doc(callId)
    .collection(collectionName)
    .add(candidate.toJSON ? candidate.toJSON() : candidate)
}

export const listenCall = (callId, onChange, onError) => {
  return callsCollection()
    .doc(callId)
    .onSnapshot(
      snap => {
        if (!snap.exists) {
          onChange(null)
          return
        }
        onChange({id: snap.id, ...snap.data()})
      },
      onError,
    )
}

export const listenRemoteCandidates = (callId, remoteRole, onCandidate) => {
  const collectionName =
    remoteRole === 'caller' ? 'callerCandidates' : 'calleeCandidates'
  return callsCollection()
    .doc(callId)
    .collection(collectionName)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          onCandidate(change.doc.data())
        }
      })
    })
}

/**
 * Listen for incoming ringing calls for the current user.
 * Uses participants query (matches security rules) and filters client-side.
 */
export const listenIncomingCalls = (uid, onChange, onError) => {
  return callsCollection()
    .where('participants', 'array-contains', uid)
    .onSnapshot(
      snapshot => {
        const calls = snapshot.docs
          .map(doc => ({id: doc.id, ...doc.data()}))
          .filter(
            call =>
              call.calleeId === uid && call.status === CALL_STATUS.RINGING,
          )
          .sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0
            const bTime = b.createdAt?.toMillis?.() || 0
            return bTime - aTime
          })
        onChange(calls)
      },
      onError,
    )
}

export const listenRecentCalls = (uid, onChange, onError) => {
  return callsCollection()
    .where('participants', 'array-contains', uid)
    .onSnapshot(
      snapshot => {
        const calls = snapshot.docs
          .map(doc => ({id: doc.id, ...doc.data()}))
          .sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0
            const bTime = b.createdAt?.toMillis?.() || 0
            return bTime - aTime
          })
          .slice(0, 40)
        onChange(calls)
      },
      onError,
    )
}

export const getCall = async callId => {
  const snap = await callsCollection().doc(callId).get()
  if (!snap.exists) {
    return null
  }
  return {id: snap.id, ...snap.data()}
}
