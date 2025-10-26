import { type EntityWithUrlRels, getEditUrlToSeedExternalLinks } from './edit_link.ts';
import type { EntityId, LinkType, ResolvableEntity } from '@/harmonizer/types.ts';
import type { EntityType } from '@kellnerd/musicbrainz/data/entity';
import { describe, it } from '@std/testing/bdd';
import { assertInstanceOf } from 'std/assert/assert_instance_of.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import type { MetadataProvider } from '@/providers/base.ts';
import type { ProviderRegistry } from '@/providers/registry.ts';

describe('getEditUrlToSeedExternalLinks', () => {
	const entityType: EntityType = 'artist';
	const sourceEntityUrl = new URL('https://source.com/entity/1');

	const mockProviders = {
		findByName: (_name: string) => ({
			constructUrl: (entity: EntityId) => new URL(`https://example.com/${entity.id}`),
			getLinkTypesForEntity: (_entity: EntityId): LinkType[] => ['paid download', 'free streaming'],
		} as unknown as MetadataProvider),
	} as unknown as ProviderRegistry;

	it('returns null if entity has no externalIds', () => {
		const entity: ResolvableEntity = { mbid: 'mbid-1', externalIds: [] };
		assertEquals(
			getEditUrlToSeedExternalLinks({ entity, entityType, sourceEntityUrl, providers: mockProviders }),
			null,
		);
	});

	it('returns null if entity has no mbid', () => {
		const entity: ResolvableEntity = { externalIds: [{ type: '', provider: 'test', id: '1' }] };
		assertEquals(
			getEditUrlToSeedExternalLinks({ entity, entityType, sourceEntityUrl, providers: mockProviders }),
			null,
		);
	});

	it('returns null if all external links already exist', () => {
		const entity: ResolvableEntity = {
			mbid: 'mbid-2',
			externalIds: [{ type: '', provider: 'test', id: '1' }],
		};
		const entityCache: EntityWithUrlRels[] = [{
			id: 'mbid-2',
			relations: [{ url: { resource: 'https://example.com/1' } }],
		}];
		assertEquals(
			getEditUrlToSeedExternalLinks({
				entity,
				entityType,
				sourceEntityUrl,
				entityCache,
				providers: mockProviders,
			}),
			null,
		);
	});

	it('returns a URL with correct search params for new links', () => {
		const entity: ResolvableEntity = {
			mbid: 'mbid-3',
			externalIds: [{ type: '', provider: 'test', id: '2', linkTypes: ['free download'] }],
		};
		const entityCache: EntityWithUrlRels[] = [{
			id: 'mbid-3',
			relations: [],
		}];
		const url = getEditUrlToSeedExternalLinks({
			entity,
			entityType,
			sourceEntityUrl,
			entityCache,
			providers: mockProviders,
		});
		assertInstanceOf(url, URL);
		assertEquals(
			url!.origin,
			'https://musicbrainz.org',
		);
		assertEquals(
			url!.pathname,
			'/artist/mbid-3/edit',
		);
		const searchParams = url!.searchParams;
		assertEquals(searchParams.get('edit-artist.url.0.text'), 'https://example.com/2');
		assertEquals(searchParams.get('edit-artist.url.0.link_type_id'), '177');
		assertEquals(searchParams.get('edit-artist.url.1.text'), null);
		assertEquals(searchParams.get('edit-artist.url.1.link_type_id'), null);
		assertEquals(
			searchParams.get('edit-artist.edit_note'),
			'Matched artist while importing https://source.com/entity/1 with Harmony',
		);
	});

	it('handles missing entityCache gracefully', () => {
		const entity: ResolvableEntity = {
			mbid: 'mbid-4',
			externalIds: [{ type: '', provider: 'test', id: '3', linkTypes: ['free download'] }],
		};
		const url = getEditUrlToSeedExternalLinks({ entity, entityType, sourceEntityUrl, providers: mockProviders });
		assertInstanceOf(url, URL);
		const searchParams = url!.searchParams;
		assertEquals(searchParams.get('edit-artist.url.0.text'), 'https://example.com/3');
		assertEquals(searchParams.get('edit-artist.url.0.link_type_id'), '177'); // free download
		assertEquals(searchParams.get('edit-artist.url.1.text'), null);
		assertEquals(searchParams.get('edit-artist.url.1.link_type_id'), null);
	});

	it('defaults to provider link types if none are specified', () => {
		const entity: ResolvableEntity = {
			mbid: 'mbid-6',
			externalIds: [{ type: '', provider: 'test', id: '5' }],
		};
		const entityCache: EntityWithUrlRels[] = [{
			id: 'mbid-6',
			relations: [],
		}];
		const url = getEditUrlToSeedExternalLinks({
			entity,
			entityType,
			sourceEntityUrl,
			entityCache,
			providers: mockProviders,
		});
		assertInstanceOf(url, URL);
		const searchParams = url!.searchParams;
		assertEquals(searchParams.get('edit-artist.url.0.text'), 'https://example.com/5');
		assertEquals(searchParams.get('edit-artist.url.0.link_type_id'), '176'); // paid download
		assertEquals(searchParams.get('edit-artist.url.1.text'), 'https://example.com/5');
		assertEquals(searchParams.get('edit-artist.url.1.link_type_id'), '194'); // free streaming
		assertEquals(searchParams.get('edit-artist.url.2.text'), null);
		assertEquals(searchParams.get('edit-artist.url.2.link_type_id'), null);
	});

	it('includes external links with empty link types', () => {
		const entity: ResolvableEntity = {
			mbid: 'mbid-7',
			externalIds: [{ type: '', provider: 'test', id: '6', linkTypes: [] }],
		};
		const entityCache: EntityWithUrlRels[] = [{
			id: 'mbid-7',
			relations: [],
		}];
		const url = getEditUrlToSeedExternalLinks({
			entity,
			entityType,
			sourceEntityUrl,
			entityCache,
			providers: mockProviders,
		});
		assertInstanceOf(url, URL);
		const searchParams = url!.searchParams;
		assertEquals(searchParams.get('edit-artist.url.0.text'), 'https://example.com/6');
		assertEquals(searchParams.get('edit-artist.url.0.link_type_id'), null); // No link type
		assertEquals(searchParams.get('edit-artist.url.1.text'), null);
		assertEquals(searchParams.get('edit-artist.url.1.link_type_id'), null);
	});

	it('returns null if no new external links after filtering', () => {
		const entity: ResolvableEntity = {
			mbid: 'mbid-5',
			externalIds: [{ type: '', provider: 'test', id: '4' }],
		};
		const entityCache: EntityWithUrlRels[] = [{
			id: 'mbid-5',
			relations: [{ url: { resource: 'https://example.com/4' } }],
		}];
		assertEquals(
			getEditUrlToSeedExternalLinks({
				entity,
				entityType,
				sourceEntityUrl,
				entityCache,
				providers: mockProviders,
			}),
			null,
		);
	});
});
