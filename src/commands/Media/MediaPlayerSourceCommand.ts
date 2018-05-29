import { AtemState } from '../../state'
import { MediaPlayerSource } from '../../state/media'
import AbstractCommand from '../AbstractCommand'
import { Enums } from '../..'

export class MediaPlayerSourceCommand extends AbstractCommand {
	rawName = 'MPCE'
	mediaPlayerId: number

	properties: MediaPlayerSource
	newProperties: {
		sourceType: Enums.MediaSourceType,
		stillIndex: number,
		clipIndex: number
	}
	MaskFlags = {
		sourceType: 1 << 0,
		stillIndex: 1 << 1,
		clipIndex: 1 << 2
	}

	updateProps (newProps: Partial<{ sourceType: Enums.MediaSourceType, stillIndex: number, clipIndex: number }>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.mediaPlayerId = rawCommand[0]
		this.properties = {
			sourceType: rawCommand[1],
			sourceIndex: rawCommand[3]
		}
	}

	serialize () {
		const rawCommand = 'MPSS'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.flag,
			this.mediaPlayerId,
			this.newProperties.sourceType,
			this.newProperties.clipIndex,
			this.newProperties.stillIndex,
			0x00,
			0x00,
			0x00
		])
	}

	applyToState (state: AtemState) {
		state.media.players[this.mediaPlayerId] = {
			...state.media.players[this.mediaPlayerId],
			...this.properties
		}
	}
}
